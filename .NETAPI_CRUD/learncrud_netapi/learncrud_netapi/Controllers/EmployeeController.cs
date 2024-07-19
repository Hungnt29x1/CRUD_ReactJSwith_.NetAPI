using learncrud_netapi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace learncrud_netapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _employeeDbContext;

        public EmployeeController(EmployeeDbContext employeeDbContext)
        {
            _employeeDbContext = employeeDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetEmployees()
        {
            if (_employeeDbContext.Employees == null)
            {
                return NotFound();
            }
            return await _employeeDbContext.Employees.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployees(int id)
        {
            if (_employeeDbContext.Employees == null)
            {
                return NotFound();
            }
            var eployee = await _employeeDbContext.Employees.FindAsync(id);
            if (eployee == null)
            {
                return NotFound();
            }
            return eployee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployees(Employee employee)
        {
            _employeeDbContext.Employees.Add(employee);
            await _employeeDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmployees), new { id = employee.ID }, employee);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutEmployees(int id, Employee employee)
        {
            if (id != employee.ID)
            {
                return BadRequest();
            }
            _employeeDbContext.Entry(employee).State = EntityState.Modified;
            try
            {
                await _employeeDbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployees(int id)
        {
            if (_employeeDbContext.Employees == null)
            {
                return NotFound();
            }
            var employee = await _employeeDbContext.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            _employeeDbContext.Employees.Remove(employee);
            await _employeeDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
